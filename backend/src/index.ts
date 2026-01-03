import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'API is running' });
});

app.get('/api/getBerthPosition', (req, res) => {
    const { berthNumber } = req.query;

    if (!berthNumber) {
        return res.status(400).json({
            error: 'Berth number is required',
            message: 'Please provide a berthNumber query parameter'
        });
    }

    const number = parseInt(berthNumber as string);

    if (isNaN(number) || number < 1) {
        return res.status(400).json({
            error: 'Invalid berth number',
            message: 'Berth number must be a positive number'
        });
    }

    let position: string;
    const remainder = number % 8;

    switch (remainder) {
        case 1:
        case 4:
            position = 'Lower';
            break;
        case 2:
        case 5:
            position = 'Middle';
            break;
        case 3:
        case 6:
            position = 'Upper';
            break;
        case 7:
            position = 'Side Lower';
            break;
        case 0:
            position = 'Side Upper';
            break;
        default:
            position = 'Unknown';
    }

    res.json({
        success: true,
        data: {
            berthNumber: number,
            position: position
        }
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});