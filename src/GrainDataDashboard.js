import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register necessary Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);


const GrainDataDashboard = () => {
    const [grainData, setGrainData] = useState([]);
    const [filters, setFilters] = useState({
        type: 'Paddy',
        status: 'Accepted',
        minPercentage: 10,
        maxPercentage: 15,
    });

    const fetchGrainData = async () => {
        try {
            const response = await axios.get('/api/grain/filter', { params: filters });
            setGrainData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchGrainData();
    }, [filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const chartData = {
        labels: grainData.map(item => item.type),
        datasets: [
            {
                label: 'Quantity',
                data: grainData.map(item => item.quantity),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Grain Quantity by Type',
            },
        },
    };

    return (
        <div>
            <h1>Grain Data Dashboard</h1>

            <div>
                <input name="type" placeholder="Type" onChange={handleFilterChange} value={filters.type} />
                <input name="status" placeholder="Status" onChange={handleFilterChange} value={filters.status} />
                <input name="minPercentage" placeholder="Min Nami %" type="number" onChange={handleFilterChange} value={filters.minPercentage} />
                <input name="maxPercentage" placeholder="Max Nami %" type="number" onChange={handleFilterChange} value={filters.maxPercentage} />
                <button onClick={fetchGrainData}>Apply Filters</button>
            </div>

            <table>
                <thead>
                <tr>
                    <th>Type</th>
                    <th>Quantity</th>
                    <th>Nami %</th>
                    <th>Status</th>
                </tr>
                </thead>
                <tbody>
                {grainData.map((data) => (
                    <tr key={data.id}>
                        <td>{data.type}</td>
                        <td>{data.quantity}</td>
                        <td>{data.percentageNami}</td>
                        <td>{data.status}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            <Bar data={chartData} options={chartOptions} />
        </div>
    );
};

export default GrainDataDashboard;
