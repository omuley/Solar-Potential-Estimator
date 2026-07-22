import { currency } from '../../utils/formatter';
import { COLORS } from '../../utils/chartColors';
import CustomTooltip from './ChartTooltip';
import {
    ResponsiveContainer,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Bar,
} from 'recharts';

export default function AnnualSavingsChart({ data }) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.yearlyProjection} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid stroke={COLORS.grid} vertical={false} />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} stroke={COLORS.ink}
                label={{ value: 'Year', position: 'insideBottom', offset: -2, fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} stroke={COLORS.ink} tickFormatter={currency} width={70} />
                <Tooltip content={<CustomTooltip formatter={currency} />} />
                <Bar dataKey="yearlySavings" name="Annual Savings" fill={COLORS.sky} radius={[3, 3, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}