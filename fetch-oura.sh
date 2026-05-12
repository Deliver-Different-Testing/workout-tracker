#!/bin/bash
# Fetch latest Oura data and save as static JSON for the app
OURA_TOKEN="4Z54ECQV6JAB2OSFJW7QY5TSIKBQN7PQ"
DIR="/data/.openclaw/workspace/workout-tracker"
END=$(date +%Y-%m-%d)
START=$(date -d "-30 days" +%Y-%m-%d)

curl -s -H "Authorization: Bearer $OURA_TOKEN" \
  "https://api.ouraring.com/v2/usercollection/daily_sleep?start_date=$START&end_date=$END" > "$DIR/oura-sleep.json"

curl -s -H "Authorization: Bearer $OURA_TOKEN" \
  "https://api.ouraring.com/v2/usercollection/daily_readiness?start_date=$START&end_date=$END" > "$DIR/oura-readiness.json"

curl -s -H "Authorization: Bearer $OURA_TOKEN" \
  "https://api.ouraring.com/v2/usercollection/daily_activity?start_date=$START&end_date=$END" > "$DIR/oura-activity.json"

# Deploy to GH Pages
cd "$DIR"
git add oura-*.json
git commit -m "Update Oura data $(date +%Y-%m-%d)" 2>/dev/null
npx gh-pages -d . 2>/dev/null
