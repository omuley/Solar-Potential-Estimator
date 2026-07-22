import { COLORS } from '../../utils/chartColors';
import CustomTooltip from './ChartTooltip';
import {
    ResponsiveContainer,
    LineChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,

    Line,
} from 'recharts';

export default function EnergyUseChart({ data }) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.yearlyProjection} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid stroke={COLORS.grid} vertical={false} />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} stroke={COLORS.ink}
                label={{ value: 'Year', position: 'insideBottom', offset: -2, fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} stroke={COLORS.ink}
                tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`} width={60}
                label={{ value: 'kWh', angle: -90, position: 'insideLeft', fontSize: 12 }} />
                <Tooltip content={<CustomTooltip formatter={(v) => `${v.toLocaleString()} kWh`} />} />
                <Line type="monotone" dataKey="production" name="Production"
                stroke={COLORS.sun} strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
            </LineChart>
        </ResponsiveContainer>
    );
}