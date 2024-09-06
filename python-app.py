from flask import Flask, request, jsonify
import pandas as pd
import re
import logging
from flask_cors import CORS

import requests

app = Flask(__name__)
CORS(app, resources={r"/proceedExcel": {"origins": "http://localhost:4200"},
                      r"/proceedDeliveryNote": {"origins": "http://localhost:4200"}})

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route('/proceedExcel', methods=['POST'])
def proceedExcel():
    #if 'foodFile' or 'meatFile' not in request.files:
    #    return jsonify({'error': 'No file part'}), 400

    foodFile = request.files['foodFile']
    meatFile = request.files['meatFile']
    food_sheet_name = request.form.get('foodSheet', None)
    meat_sheet_name = request.form.get('meatSheet', None)
    if foodFile.filename == '' or meatFile.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    allIngredients = []
    if foodFile:
        try:
            df = pd.read_excel(foodFile, sheet_name=food_sheet_name)
            result = get_ingredients(df)
            allIngredients.extend(result)
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    if meatFile:
        try:
            df = pd.read_excel(meatFile, sheet_name=meat_sheet_name)
            result = get_meats(df)
            allIngredients.extend(result)
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    return jsonify(allIngredients)
        

@app.route('/proceedDeliveryNote', methods=['POST'])
def proceedDeliveryNote():
    
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file:
        try:
            df = pd.read_excel(file)
            result = get_delivered_ingredients(df)
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
    
def get_delivered_ingredients(df):
    try:

        objects = []
        
        for index, row in df.iterrows():
            if row == 0:
                continue
            
            if pd.notna(row[0]) and pd.notna(row[1]):
                object_data = {
                    'name': row[0],
                    'quantity': row[1]
                }
                objects.append(object_data)

        return objects

    except Exception as e:
        print(f"An error occurred: {e}")

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

def get_meats(df):
    try:

        nameColumn = find_column_index_in_cell(df, ['VRSTE MESA'])
        if(nameColumn == None):
            print("Ne postoji kolona sa imenom mesa.")

        quantityColumn = find_column_index_in_cell(df, ['ugovoreno', 'ugo.količina', 'ugov. Kolicina'])
        if(quantityColumn == None):
            print("Ne postoji kolona sa imenom ugovoreno")

        objects = []
        first_search_term = True
        
        for index, row in df.iterrows():
            if 'VRSTE MESA' in row.values:
                first_search_term = False
                continue
            elif first_search_term:
                continue
            
            if pd.notna(row[nameColumn]) and pd.notna(row[quantityColumn]):
                object_data = {
                    'name': row[nameColumn],
                    'warehouseUnitShortName': 'kg',
                    'scale': 0,
                    'unitShortName': 'kg',
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
