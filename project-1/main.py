from datetime import datetime
from functools import total_ordering
from unittest import result
from flask import Flask, render_template

import h11

app = Flask(__name__)


@app.route('/index')
@app.route('/')
def index():
    return "<h1>hello WORLD!</h1>"


@app.route('/sum/x=<x>&y=<y>')
def get_sum(x, y):
    try:
        total = str(eval(x)+eval(y))

    except Exception as e:
        print(e)
        result = '輸入錯誤'
    result = {'x': x,
              'y': y,
              'total': total

              }
    return render_template('./index.html', result=result)


@app.route('/today')
@app.route('/today/<name>')
def getToday(name='GUEST'):
    today = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    return f'<h1> Hello {name},welcome<br>{today}'


@app.route('/stock')
def stock():
    stocks = [
        {'分類': '日經指數', '指數': '22,920.30'},
        {'分類': '韓國綜合', '指數': '2,304.59'},
        {'分類': '香港恆生', '指數': '25,083.71'},
        {'分類': '上海綜合', '指數': '3,380.68'}
    ]

    for stock in stocks:
        print(stock['分類'], stock['指數'])

    return render_template('./stock.html', stocks=stocks)


if __name__ == '__main__':
    print(getToday('JERRY'))
    app.run(debug=True)
