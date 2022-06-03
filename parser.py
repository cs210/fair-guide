"""Parse a CSV spreadsheet of project submissions into a json file.

This is useful for parsing Google Forms responses into a submissions.json file.
"""

import json
from argparse import ArgumentParser

import pandas as pd


COLUMN_NAMES = {
    'project_name' : 'What title would you like in the program for your project?',
    'team_members' : 'Please list the people involved in this project.',
    'description' : 'Please provide a project blurb that will appear in the Software Fair program.',
    'placement' : 'Please check any genres you feel apply to your project.'
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

def add_category(placement_dict, category_name):
    placement_dict["categories"][category_name] = {"name": category_name}


def main(args):
    """Parse the specified CSV file and write it to a JSON file."""
    total_json = parse_csv(args.csv)

    # Handle multiple categories / dynamically populate categories in placement
    # TODO: clean up
    placement = {}
    placement["categories"] = {}
    
    for item in total_json["submissions"]:
        if "placement" in item:
            category_names = item.get("placement").split(", ")
            for category_name in category_names:
                add_category(placement, category_name)
                
            item["placement"] = category_names
            
        else:
            # submissions with no category get placed in "Other"
            add_category(placement, "Other")
            item["placement"] = ["Other"]
    
    # add an "All" category
    add_category(placement, "All")
    
    # dump json to files
    with open(args.out_submissions, 'w') as f:
        json.dump(total_json, f, sort_keys=True, indent=2)
        
    with open(args.out_placement, 'w') as f:
        json.dump(placement, f, sort_keys=True, indent=2)


if __name__ == '__main__':
    parser = ArgumentParser()
    parser.add_argument('csv', help='Path of CSV file to parse.')
    parser.add_argument('--out_submissions', default='src/data/submissions.json',
                        help='Path of JSON file to create for project submissions.')
    parser.add_argument('--out_placement', default='src/data/placement.json',
                        help='Path of JSON file to create for placement (i.e. categories).')
    args = parser.parse_args()
    main(args)
