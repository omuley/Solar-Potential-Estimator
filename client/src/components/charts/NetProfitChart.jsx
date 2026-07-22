import { currency } from '../../utils/formatter';
import { COLORS } from '../../utils/chartColors';
import CustomTooltip from './ChartTooltip';
import {
    ResponsiveContainer,
    LineChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ReferenceLine,
    Line,
} from 'recharts';

export default function NetProfitChart({ data }) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.yearlyData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                    <CartesianGrid stroke={COLORS.grid} vertical={false} />
                    <XAxis dataKey="year" tick={{ fontSize: 12 }} stroke={COLORS.ink}
                    label={{ value: 'Year', position: 'insideBottom', offset: -2, fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} stroke={COLORS.ink} tickFormatter={currency} width={70} />
                    <Tooltip content={<CustomTooltip formatter={currency} />} />
                    <ReferenceLine y={0} stroke={COLORS.ink} strokeOpacity={0.5} strokeDasharray="3 3"
                    label={{ value: 'Break-even', fontSize: 11, fill: COLORS.ink, position: 'insideBottomLeft' }} />
                    <Line type="monotone" dataKey="cumulativeProfit" name="Net Profit"
                    stroke={COLORS.rust} strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
            </LineChart>
        </ResponsiveContainer>
    );
}