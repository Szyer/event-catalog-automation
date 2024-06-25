import json
import pandas as pd

# Function to read JSON file and handle potential errors
def read_json_file(filename):
    try:
        with open(filename, 'r', encoding='utf-8-sig') as file:
            return json.load(file)
    except json.JSONDecodeError as err:
        print(f"JSONDecodeError: {err}")
        return None
    except Exception as e:
        print(f"An error occurred: {e}")
        return None

# Read JSON data from file
json_data = read_json_file('file2.json')

# Function to extract "key" or "type" values
def extract_keys(json_data):
    keys = []
    if json_data and 'aggregations' in json_data and 'unique_event_types' in json_data['aggregations']:
        for bucket in json_data['aggregations']['unique_event_types']['buckets']:
            keys.append(bucket['key'])
    return keys

if json_data:
    # Extract keys
    keys = extract_keys(json_data)

    # Create a DataFrame and save to Excel
    df = pd.DataFrame(keys, columns=['Type/Key'])
    df.to_excel('event_types.xlsx', index=False)

    print("Excel file created successfully.")
else:
    print("Failed to read JSON data.")
