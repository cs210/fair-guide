import pandas as pd
import sys
import json

csv = pd.read_csv(sys.argv[1]).values.tolist()

submissions = []

for [timestamp, team_name, members, course, description] in csv:
    submission = {"course_id": course, "description": description, "project_name": team_name, "team_members": members, "placement": ["All"]}
    submissions.append(submission)

print(json.dumps({"submissions": submissions}, ensure_ascii=True, indent=4))
