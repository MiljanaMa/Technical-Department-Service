from flask import Flask, request, jsonify
import pandas as pd
import re
import logging
from flask_cors import CORS

import requests

app = Flask(__name__)
CORS(app, resources={r"/proceedExcel": {"origins": "http://localhost:4200"}})

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route('/proceedExcel', methods=['POST'])
def proceedExcel():
    
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    sheet_name = request.form.get('sheet', None)

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file:
        try:
            df = pd.read_excel(file, sheet_name=sheet_name)
            result = get_ingredients(df)
            return jsonify(result)
        except Exception as e:
            return jsonify({'error': str(e)}), 500


def find_column_index_in_cell(df, search_terms):
    try:
        for row_index, row in df.iterrows():
            for term in search_terms:
                if term in row.values:
                    col_index = row[row == term].index[0]
                    return col_index
        return None

    except Exception as e:
        return None

def get_ingredients(df):
    try:

        nameColumn = find_column_index_in_cell(df, ['naziv robe'])
        if(nameColumn == None):
            print("Ne postoji kolona sa imenom ugovoreno")

        unitColumn = find_column_index_in_cell(df, ['jed.mjere.'])
        if(unitColumn == None):
            print("Ne postoji kolona sa imenom jed.mjere.")

        quantityColumn = find_column_index_in_cell(df, ['ugovoreno', 'ugo.količina'])
        if(quantityColumn == None):
            print("Ne postoji kolona sa imenom ugovoreno")

        objects = []
        first_search_term = True
        pattern = r'(\d+[.,]?\d*)\s*(g|gr|kg|l|ml)'
        
        for index, row in df.iterrows():
            if 'naziv robe' in row.values:
                first_search_term = False
                continue
            elif first_search_term:
                continue
            
            if pd.notna(row[nameColumn]) and pd.notna(row[unitColumn]) and pd.notna(row[quantityColumn]):
                unit = row[unitColumn]
                number = 0
                if not (row[unitColumn] == 'kg' or row[unitColumn] == 'lit'):
                    match = re.search(pattern, row[nameColumn])
                    if match:
                        number, unit = convert_to_standard_unit(float(match.group(1).replace(',', '.')), match.group(2))
                    

                object_data = {
                    'name': row[nameColumn],
                    'warehouseUnitShortName': row[unitColumn],
                    'scale': number,
                    'unitShortName': unit,
                    'isConfirmed': False
                }
                objects.append(object_data)

        return objects

    except Exception as e:
        print(f"An error occurred: {e}")

def convert_to_standard_unit(number, unit):
    if unit == 'kg':
        unit = 'kg'
    elif unit in ['g', 'gr']:
        number /= 1000.0
        unit = 'kg'
    elif unit == 'ml':
        number /= 1000.0
        unit = 'lit'
    elif unit in ['dl', 'dcl']:
        number /= 10.0
        unit = 'lit'
    elif unit == 'l':
        unit = 'lit'
    return number, unit

if __name__ == '__main__':
    app.run(debug=True)
