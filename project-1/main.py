from datetime import datetime
from functools import total_ordering
from unittest import result
from flask import Flask, render_template
from pm25 import get_pm25

import h11
from sqlalchemy import values

app = Flask(__name__)


@app.route('/<name>')
@app.route('/')
def index(name='Guest'):
    today = getToday()
    return render_template('./indexHome.html', today=today, name=name)


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


@app.route('/pm25/<sort>')
@app.route('/pm25')
def pm25(sort=None):
    today = getToday()
    columns, values = get_pm25(sort)
    return render_template('./pm25.html', **locals())


if __name__ == '__main__':

    app.run(debug=True)
