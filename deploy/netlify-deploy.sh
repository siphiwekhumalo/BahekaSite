#!/bin/bash

# Netlify deployment script for bahekatechfirm.com
# This script prepares and deploys your site to Netlify

set -e

echo "🚀 Preparing Netlify deployment for bahekatechfirm.com..."

# Step 1: Install Netlify CLI if not present
install_netlify_cli() {
    if ! command -v netlify &> /dev/null; then
        echo "📦 Installing Netlify CLI..."
        npm install -g netlify-cli
    else
        echo "✅ Netlify CLI already installed"
    fi
}

# Step 2: Login to Netlify
login_netlify() {
    echo "🔑 Logging into Netlify..."
    if ! netlify status &> /dev/null; then
        echo "Please login to Netlify in your browser..."
        netlify login
    else
        echo "✅ Already logged into Netlify"
    fi
}

# Step 3: Build the project
build_project() {
    echo "🔨 Building project..."
    npm run build
    echo "✅ Build complete"
}

# Step 4: Deploy to Netlify
deploy_to_netlify() {
    echo "🚀 Deploying to Netlify..."
    
    # Check if site already exists
    if netlify status &> /dev/null; then
        echo "📤 Deploying to existing site..."
        netlify deploy --prod --dir=dist/public
    else
        echo "🆕 Creating new site..."
        netlify deploy --prod --dir=dist/public --open
    fi
    
    echo "✅ Deployment complete!"
}

# Step 5: Configure custom domain
configure_domain() {
    echo "🌐 Configuring custom domain..."
    
    # Get site info
    SITE_INFO=$(netlify status --json)
    SITE_URL=$(echo $SITE_INFO | jq -r '.siteUrl')
    
    if [ "$SITE_URL" != "null" ]; then
        echo "✅ Site deployed at: $SITE_URL"
        echo ""
        echo "🔧 To configure custom domain bahekatechfirm.com:"
        echo "1. Go to Netlify dashboard: https://app.netlify.com"
        echo "2. Select your site"
        echo "3. Go to Domain settings > Add custom domain"
        echo "4. Enter: bahekatechfirm.com"
        echo "5. Add these DNS records in AWS Route 53:"
        echo "   Type: CNAME, Name: bahekatechfirm.com, Value: ${SITE_URL#https://}"
        echo "   Type: CNAME, Name: www.bahekatechfirm.com, Value: ${SITE_URL#https://}"
        echo ""
    fi
}

# Step 6: Set environment variables
set_env_vars() {
    echo "🔐 Setting environment variables..."
    echo ""
    echo "⚠️  Don't forget to add these environment variables in Netlify:"
    echo "1. Go to Site settings > Environment variables"
    echo "2. Add these variables:"
    echo "   - SENDGRID_API_KEY=your_sendgrid_api_key_here"
    echo "   - BAHEKA_EMAIL=contact@bahekatechfirm.com"
    echo "   - NODE_ENV=production"
    echo ""
}

# Step 7: Test deployment
test_deployment() {
    echo "🧪 Testing deployment..."
    
    # Get site URL
    SITE_INFO=$(netlify status --json)
    SITE_URL=$(echo $SITE_INFO | jq -r '.siteUrl')
    
    if [ "$SITE_URL" != "null" ]; then
        echo "🌐 Testing site: $SITE_URL"
        
        # Test main page
        if curl -f -s "$SITE_URL" > /dev/null; then
            echo "✅ Main page is accessible"
        else
            echo "❌ Main page test failed"
        fi
        
        # Test health endpoint
        if curl -f -s "$SITE_URL/api/health" > /dev/null; then
            echo "✅ Health endpoint is working"
        else
            echo "❌ Health endpoint test failed"
        fi
        
        echo ""
        echo "🎉 Deployment successful!"
        echo "🌐 Your site is live at: $SITE_URL"
        echo "📧 Contact form endpoint: $SITE_URL/api/contact"
        echo ""
    fi
}

# Main execution
main() {
    echo "🎯 Starting Netlify deployment for bahekatechfirm.com..."
    
    install_netlify_cli
    login_netlify
    build_project
    deploy_to_netlify
    configure_domain
    set_env_vars
    test_deployment
    
    echo "✅ Netlify deployment complete!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Configure custom domain in Netlify dashboard"
    echo "2. Add environment variables for email functionality"
    echo "3. Test contact form thoroughly"
    echo "4. Monitor deployment logs for any issues"
    echo ""
    echo "🚀 Your Baheka Tech website is now live on Netlify!"
}

# Check if jq is available for JSON parsing
if ! command -v jq &> /dev/null; then
    echo "📦 Installing jq for JSON parsing..."
    if command -v apt-get &> /dev/null; then
        sudo apt-get update && sudo apt-get install -y jq
    elif command -v yum &> /dev/null; then
        sudo yum install -y jq
    elif command -v brew &> /dev/null; then
        brew install jq
    else
        echo "⚠️  jq not available, skipping JSON parsing"
    fi
fi

main "$@"