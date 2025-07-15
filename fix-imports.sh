#!/bin/bash

# Fix all @ imports in the client/src directory

echo "Fixing @ imports..."

# Fix pages
sed -i 's|@/components/|../components/|g' client/src/pages/*.tsx
sed -i 's|@/lib/|../lib/|g' client/src/pages/*.tsx
sed -i 's|@/hooks/|../hooks/|g' client/src/pages/*.tsx

# Fix components/sections
sed -i 's|@/components/ui/|../ui/|g' client/src/components/sections/*.tsx
sed -i 's|@/lib/|../../lib/|g' client/src/components/sections/*.tsx
sed -i 's|@/hooks/|../../hooks/|g' client/src/components/sections/*.tsx

# Fix components/layout
sed -i 's|@/components/ui/|../ui/|g' client/src/components/layout/*.tsx
sed -i 's|@/lib/|../../lib/|g' client/src/components/layout/*.tsx
sed -i 's|@/hooks/|../../hooks/|g' client/src/components/layout/*.tsx

# Fix components/ui
sed -i 's|@/lib/|../../lib/|g' client/src/components/ui/*.tsx
sed -i 's|@/hooks/|../../hooks/|g' client/src/components/ui/*.tsx

# Fix hooks
sed -i 's|@/components/ui/|../components/ui/|g' client/src/hooks/*.ts

echo "Done fixing imports!"