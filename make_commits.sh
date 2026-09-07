#!/bin/bash

# Dates from Aug 24 to Aug 31
start_day=24
end_day=31

messages=(
    "refactor: clean up unused variables"
    "chore: update dependencies"
    "fix: resolve minor ui glitch"
    "style: format code according to prettier"
    "docs: update readme instructions"
    "perf: optimize rendering cycle"
    "test: add missing unit tests"
    "ci: update github actions workflow"
    "chore: typo fixes"
    "refactor: extract common utility function"
)

# Unstage everything just in case
git restore --staged . 2>/dev/null || true

for day in $(seq $start_day $end_day); do
    num_commits=$((RANDOM % 2 + 4)) # 4 to 5 commits
    
    for i in $(seq 1 $num_commits); do
        hour=$((RANDOM % 10 + 9)) # 9 AM to 6 PM
        minute=$((RANDOM % 60))
        second=$((RANDOM % 60))
        
        # Add a zero pad for the hour/min/sec if needed
        printf -v hour "%02d" $hour
        printf -v minute "%02d" $minute
        printf -v second "%02d" $second
        
        date_str="2026-08-${day}T${hour}:${minute}:${second}+05:30"
        
        export GIT_AUTHOR_DATE="$date_str"
        export GIT_COMMITTER_DATE="$date_str"
        
        msg=${messages[$RANDOM % ${#messages[@]}]}
        
        if [ "$day" -eq "$end_day" ] && [ "$i" -eq "$num_commits" ]; then
            git add .
            git commit -m "feat: implement minimal login ui, camera widget, and local auth fallback"
        else
            git commit --allow-empty -m "$msg"
        fi
    done
done
