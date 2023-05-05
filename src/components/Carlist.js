import React, { useState, useEffect, Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import Addcar from './Addcar';
import Editcar from './Editcar.js';

import Button from '@mui/material/Button';


export default function Carlist() {
    const [cars, setCars] = useState([]);
    useEffect(() => fetchData, []);

    const fetchData = () => {
        fetch('http://carrestapi.herokuapp.com/cars')
            .then(response => response.json())
            .then(data => setCars(data._embedded.cars))
    }
    const deleteCar = (link) => {
        fetch(link, { method: 'DELETE' })
            .then(res => fetchData())
            .catch(err => console.error(err))
    }
    const saveCar = (car) => {
        fetch('http://carrestapi.herokuapp.com/cars', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(car)
        })
            .then(res => fetchData())
            .catch(err => console.error(err))
      }
    const updateCar = (car, link)=>{
        fetch(link, {
          method:'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body:JSON.stringify(car)
        })
          .then (res => fetchData())
          .catch (err => console.error(err))
      }
      
    const columns = [
        { headerName: 'Brand', field: 'brand', sortable: true, filter: true, floatingFilter: true, margin: '5px' },
        { headerName: 'Model', field: 'model', sortable: true, filter: true, floatingFilter: true },
        { headerName: 'Color', field: 'color', sortable: true, filter: true, floatingFilter: true },
        { headerName: 'Fuel', field: 'fuel', sortable: true, filter: true, floatingFilter: true },
        { headerName: 'Year', field: 'year', sortable: true, filter: true, floatingFilter: true },
        { headerName: 'Price', field: 'price', sortable: true, filter: true, floatingFilter: true },
        {headerName: '', cellRendererFramework: (params) => {
                const onClick = () => {
                    const link = params.data._links.self.href;
                    deleteCar(link);
                };
                return (
                    <Button color="primary" onClick={onClick} >
                        Delete
                    </Button>
                );
            },
        },
       
        { headerName: '', cellRendererFramework: (params) =>  <Editcar updateCar={updateCar} car={params.data} />   }




    ]
    return (
        <div className="ag-theme-material" style={{ height: '700px', width: 'auto', margin: 'auto' }} >
            <Addcar saveCar={saveCar} />
            <AgGridReact rowSelection="single" rowData={cars} columnDefs={columns} animatedRows={true}  ></AgGridReact>
        </div>
    )
}