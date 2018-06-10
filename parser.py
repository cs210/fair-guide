"""Parse a CSV spreadsheet of project submissions into a json file.

This is useful for parsing Google Forms responses into a submissions.json file.
"""

import json
from argparse import ArgumentParser

import pandas as pd


COLUMN_NAMES = {
    'class': 'What class are you taking for your senior project?',
    'team_members': (
        'Please list the full names of everyone on the team as you would like '
        'them to appear on the program, separated by commas'
    ),
    'project_name': 'What is the name of your project? ',
    'team_name': 'What is the name of your team? (optional)',
    'summary': 'Give a brief, 1-2 sentence (or sentence fragment) summary of your project. ',
    'description': 'Give a longer, ~5 sentence to short paragraph "deep dive" into your project.',
    'placement': 'Category',
    'logo_url': 'Logo Url'
}


def value_is_null(val):
    """Whether a value is empty or null."""
    return val == '' or pd.isnull(val) or val == 'nan'


def parse_csv(csv_path):
    """Parse the specified CSV file into a dict."""
    submissions = pd.read_csv(csv_path)
    total_json = {}
    submissions_list = []
    for index, entry in submissions.iterrows():
        entry = {column: str(entry[column_name]).strip()
                 for (column, column_name) in COLUMN_NAMES.items()}
        entry_non_null = {column: value for (column, value) in entry.items()
                          if not value_is_null(value)}
        submissions_list.append(entry_non_null)

    total_json['submissions'] = submissions_list
    return total_json


def main(args):
    """Parse the specified CSV file and write it to a JSON file."""
    total_json = parse_csv(args.csv)
    with open(args.out, 'w') as f:
        json.dump(total_json, f, sort_keys=True, indent=2)


if __name__ == '__main__':
    parser = ArgumentParser()
    parser.add_argument('csv', help='Path of CSV file to parse.')
    parser.add_argument('--out', default='src/data/submissions.json',
                        help='Path of JSON file to create.')
    args = parser.parse_args()
    main(args)
