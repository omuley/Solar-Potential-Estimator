import { COLORS } from '../../utils/chartColors';

export default function CustomTooltip({ active, payload, label, formatter }) {
    if (!active || !payload || !payload.length) return null;
    return (
        <div style={{
            background: COLORS.ink,
            color: COLORS.paper,
            padding: '10px 14px',
            borderRadius: 6,
            fontSize: 13,
            fontFamily: 'ui-monospace, monospace',
            boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
            }}>
            <div style={{ opacity: 0.7, marginBottom: 4 }}>Year {label}</div>
            {payload.map((p, i) => (
                <div key={i} style={{ color: p.color }}>
                    {p.name}: {formatter ? formatter(p.value) : p.value}
                </div>
            ))}
        </div>
    );
};