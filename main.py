
from datetime import datetime
from functools import total_ordering
from multiprocessing.sharedctypes import Value
from unittest import result
from flask import Flask, render_template, request
# from requests import request
from scrape.pm25 import get_pm25, get_six_pm25, get_all_city, get_city_pm25
import json

app = Flask(__name__)


@app.route('/<name>')
@app.route('/')
def index(name='Guest'):
    today = getToday()
    return render_template('./indexHome.html', today=today, name=name)


@app.route('/city-pm25/<city>', methods=['POST'])
def pm25_city_json(city):
    stationName, result = get_city_pm25(city)

    return json.dumps({'stationName': stationName, 'result': result}, ensure_ascii=False)


@app.route('/sum/x=<x>&y=<y>')
def get_sum(x, y):
    try:
        total = str(eval(x)+eval(y))

    except Exception as e:
        print(e)
        total = '輸入錯誤'
    result = {'x': x,
              'y': y,
              'total': total

              }
    return render_template('./index.html', result=result)


# @app.route('/today')
# @app.route('/today/<name>')
def getToday():
    today = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    return today


@app.route('/stock')
def stock():
    today = getToday()
    stocks = [
        {'分類': '日經指數', '指數': '22,920.30'},
        {'分類': '韓國綜合', '指數': '2,304.59'},
        {'分類': '香港恆生', '指數': '25,083.71'},
        {'分類': '上海綜合', '指數': '3,380.68'}
    ]

    for stock in stocks:
        print(stock['分類'], stock['指數'])

    return render_template('./stock.html', stocks=stocks)


@app.route('/pm25chart')
def pm25chart():
    citys = get_all_city()
    return render_template('./pm25-charts-bulma.html', countys=citys)


@app.route('/six-pm25-json', methods=['POST'])
def pm25_six_json():
    six_citys, result = get_six_pm25()

    return json.dumps({'citys': six_citys, 'result': result}, ensure_ascii=False)


@app.route('/pm25-chart')
def pm25_chart():
    citys = get_all_city()
    return render_template('./pm25-charts-bulma.html', countys=citys)


@app.route('/pm25-json', methods=['GET', 'POST'])
def pm25_json():
    columns, values = get_pm25(False)
    stationName = [value[1] for value in values]
    result = [value[2] for value in values]
    data = {'date': getToday(), 'stationName': stationName, 'result': result}
    return json.dumps(data, ensure_ascii=False)


@app.route('/pm25', methods=['GET', 'POST'])
def pm25():
    sort = False
    if(request.method == 'POST'):
        if request.form.get('sort'):
            sort = True

    today = getToday()
    columns, values = get_pm25(sort)
    return render_template('./pm25.html', **locals())


if __name__ == '__main__':

    app.run(debug=True)
