#!/bin/bash

# AWS DNS Setup for bahekatechfirm.com
# Configure Route 53 DNS records to point to EC2 instance

set -e

echo "🌐 Setting up AWS DNS for bahekatechfirm.com..."

# Configuration
DOMAIN="bahekatechfirm.com"
HOSTED_ZONE_ID=""
SERVER_IP=""

# Function to get hosted zone ID
get_hosted_zone_id() {
    echo "🔍 Finding hosted zone for $DOMAIN..."
    
    # Check if AWS CLI is configured
    if ! aws sts get-caller-identity &>/dev/null; then
        echo "❌ AWS CLI not configured. Please run: aws configure"
        echo "💡 You need AWS access key and secret key"
        exit 1
    fi
    
    # Find hosted zone
    HOSTED_ZONE_ID=$(aws route53 list-hosted-zones --query "HostedZones[?Name=='${DOMAIN}.'].Id" --output text | sed 's|/hostedzone/||')
    
    if [ -z "$HOSTED_ZONE_ID" ]; then
        echo "❌ Hosted zone for $DOMAIN not found"
        echo "💡 Creating hosted zone..."
        
        # Create hosted zone
        aws route53 create-hosted-zone \
            --name "$DOMAIN" \
            --caller-reference "$(date +%s)" \
            --hosted-zone-config Comment="Baheka Tech production domain"
        
        # Get the new zone ID
        HOSTED_ZONE_ID=$(aws route53 list-hosted-zones --query "HostedZones[?Name=='${DOMAIN}.'].Id" --output text | sed 's|/hostedzone/||')
    fi
    
    echo "✅ Hosted zone ID: $HOSTED_ZONE_ID"
}

# Function to get server IP
get_server_ip() {
    echo "🔍 Getting server IP address..."
    
    # Try to get EC2 instance IP
    if command -v curl &> /dev/null; then
        SERVER_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo "")
    fi
    
    if [ -z "$SERVER_IP" ]; then
        echo "💡 Please provide your server IP address:"
        read -p "Server IP: " SERVER_IP
    fi
    
    echo "✅ Server IP: $SERVER_IP"
}

# Function to create DNS records
create_dns_records() {
    echo "📝 Creating DNS records..."
    
    # Create change batch JSON
    cat > /tmp/dns-changes.json << EOF
{
    "Changes": [
        {
            "Action": "UPSERT",
            "ResourceRecordSet": {
                "Name": "$DOMAIN",
                "Type": "A",
                "TTL": 300,
                "ResourceRecords": [
                    {
                        "Value": "$SERVER_IP"
                    }
                ]
            }
        },
        {
            "Action": "UPSERT",
            "ResourceRecordSet": {
                "Name": "www.$DOMAIN",
                "Type": "A",
                "TTL": 300,
                "ResourceRecords": [
                    {
                        "Value": "$SERVER_IP"
                    }
                ]
            }
        }
    ]
}
EOF
    
    # Apply DNS changes
    CHANGE_ID=$(aws route53 change-resource-record-sets \
        --hosted-zone-id "$HOSTED_ZONE_ID" \
        --change-batch file:///tmp/dns-changes.json \
        --query 'ChangeInfo.Id' \
        --output text)
    
    echo "✅ DNS change submitted: $CHANGE_ID"
    
    # Wait for changes to propagate
    echo "⏳ Waiting for DNS propagation..."
    aws route53 wait resource-record-sets-changed --id "$CHANGE_ID"
    
    echo "✅ DNS records created successfully!"
}

# Function to verify DNS
verify_dns() {
    echo "🔍 Verifying DNS resolution..."
    
    # Test DNS resolution
    for i in {1..10}; do
        if nslookup "$DOMAIN" &>/dev/null; then
            echo "✅ DNS resolution successful!"
            return 0
        fi
        echo "⏳ Waiting for DNS propagation... (attempt $i/10)"
        sleep 30
    done
    
    echo "⚠️  DNS may take longer to propagate globally"
    echo "💡 You can continue with deployment"
}

# Main execution
main() {
    echo "🚀 Starting AWS DNS setup for $DOMAIN..."
    
    # Get hosted zone ID
    get_hosted_zone_id
    
    # Get server IP
    get_server_ip
    
    # Create DNS records
    create_dns_records
    
    # Verify DNS
    verify_dns
    
    echo ""
    echo "✅ AWS DNS setup complete!"
    echo ""
    echo "📋 DNS Records Created:"
    echo "   $DOMAIN -> $SERVER_IP"
    echo "   www.$DOMAIN -> $SERVER_IP"
    echo ""
    echo "🌐 Your domain should now resolve to your server"
    echo "💡 You can now run the full deployment script"
    
    # Clean up
    rm -f /tmp/dns-changes.json
}

main "$@"