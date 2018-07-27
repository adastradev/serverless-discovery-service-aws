# sed -e "s|AWS_REGION|$AWS_REGION|" test/system/lib/config.ts.sample > test/system/lib/config.ts
# sed -i -e "s|AWS_UNAUTH_ACCESS_KEY_ID|$AWS_UNAUTH_ACCESS_KEY_ID|" test/system/lib/config.ts
# sed -i -e "s|AWS_UNAUTH_SECRET_ACCESS_KEY|$AWS_UNAUTH_SECRET_ACCESS_KEY|" test/system/lib/config.ts
npm run-script system-test
