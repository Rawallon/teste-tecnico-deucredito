from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

import typing


# local imports
from server import config


app = FastAPI()
templates = Jinja2Templates(directory="templates")
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get('/')
async def main():
    """Deployment health check"""
    return {
        'health_check': 'ok',
        'version': config.SERVER_VERSION
    }


@app.get('/api/data/invoices', response_class=HTMLResponse)
async def get_invoices(request: Request):
    """ Loads all invoice data from JSON """
    file = open('data/invoices.json', 'r')
    fileData = file.read()
    file.close()
    return fileData
    
@app.get('/api/data/products', response_class=HTMLResponse)
async def get_products_data(request: Request):
    """ Loads all products data from JSON """
    file = open('data/products.json', 'r')
    fileData = file.read()
    file.close()
    return fileData
    
    
@app.get('/dashboard', response_class=HTMLResponse)
async def render_dashboard(request: Request):
    """Returns the dashboard page"""
    return templates.TemplateResponse("dashboard.html", {"request": request})
