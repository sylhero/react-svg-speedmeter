import React from 'react';
import { css } from 'emotion';
export interface SpeedMeterProps {
    label?: string;
    min?: number;
    max?: number;
    value?: number;
    width?: number;
    height?: number;
    minMaxLabelsOffset?: number;
    color?: string;
    backgroundColor?: string;
    gradients?: Array<{
        offset: string;
        color: string;
    }>;
    topLabelStyle?: any;
    valueLabelStyle?: any;
    minMaxLabelStyle?: any;
    svgWrapperStyle?: any;
}
const defaultProps = {
    label: 'React SVG Gauge',
    min: 0,
    max: 100,
    value: 40,
    width: 400,
    height: 320,
    minMaxLabelsOffset: 25,
    color: '#fe0400',
    backgroundColor: '#edebeb',
    gradients: [
        {
            offset: '0%',
            color: '#24C6DC'
        },
        {
            offset: '50%',
            color: '#24C6DC'
        },
        {
            offset: '100%',
            color: '#514A9D'
        }
    ],
    topLabelStyle: {
        textAnchor: 'middle',
        fill: '#999999',
        stroke: 'none',
        fontStyle: 'normal',
        fontVariant: 'normal',
        fontWeight: 'bold',
        fontStretch: 'normal',
        lineHeight: 'normal',
        fillOpacity: 1
    },
    valueLabelStyle: {
        textAnchor: 'middle',
        fill: 'blue',
        fontSize: '1rem',
        fontStyle: 'normal',
        fontVariant: 'normal',
        fontWeight: 'normal',
        fontStretch: 'normal',
        lineHeight: 'normal',
        fontFamily: 'Arial, Helvetica, sans-serif',
        fillOpacity: 0.5
    },
    minMaxLabelStyle: {
        textAnchor: 'middle',
        fill: '#999999',
        stroke: 'none',
        fontStyle: 'normal',
        fontVariant: 'normal',
        fontWeight: 'normal',
        fontStretch: 'normal',
        fontSize: 20,
        lineHeight: 'normal',
        fillOpacity: 1
    }
};

const getPathValues = (value: number, props: SpeedMeterProps) => {
    if (value < props.min) value = props.min;
    if (value > props.max) value = props.max;

    const dx = 0;
    const dy = 0;

    const alpha = (1 - (value - props.min) / (props.max - props.min)) * Math.PI;
    const Ro = props.width / 2 - props.width / 10;
    const Ri = Ro - props.width / 6.666666666666667;

    const Cx = props.width / 2 + dx;
    const Cy = props.height / 1.25 + dy;

    const Xo = props.width / 2 + dx + Ro * Math.cos(alpha);
    const Yo = props.height - (props.height - Cy) - Ro * Math.sin(alpha);
    const Xi = props.width / 2 + dx + Ri * Math.cos(alpha);
    const Yi = props.height - (props.height - Cy) - Ri * Math.sin(alpha);

    return { alpha, Ro, Ri, Cx, Cy, Xo, Yo, Xi, Yi };
};

const getPath = (value: number, props: SpeedMeterProps) => {
    const { Ro, Ri, Cx, Cy, Xo, Yo, Xi, Yi } = getPathValues(value, props);

    let path = 'M' + (Cx - Ri) + ',' + Cy + ' ';
    path += 'L' + (Cx - Ro) + ',' + Cy + ' ';
    path += 'A' + Ro + ',' + Ro + ' 0 0 1 ' + Xo + ',' + Yo + ' ';
    path += 'L' + Xi + ',' + Yi + ' ';
    path += 'A' + Ri + ',' + Ri + ' 0 0 0 ' + (Cx - Ri) + ',' + Cy + ' ';
    path += 'Z ';

    return path;
};
const SpeedMeter: React.FC<SpeedMeterProps> = (props) => {
    props = defaultProps;
    const baseWrapper = css`
        display: inline-block;
        position: relative;
        width: 300px;
        height: 300px;
        padding-bottom: 100%;
        vertical-align: middle;
        overflow: hidden;
    `;
    const baseContent = css`
        display: inline-block;
        position: relative;
        width: 100%;
        padding-bottom: 100%;
        vertical-align: middle;
        overflow: hidden;
    `;
    const uniqueFilterId = 'uniqueFilter';
    const topLabelStyle = props.topLabelStyle.fontSize
        ? props.topLabelStyle
        : { ...props.topLabelStyle, fontSize: props.width / 10 };
    const valueLabelStyle = props.valueLabelStyle.fontSize
        ? props.valueLabelStyle
        : { ...props.valueLabelStyle, fontSize: props.width / 5 };
    const { minMaxLabelsOffset } = props;
    const { Cx, Ro, Ri, Xo, Cy, Xi } = getPathValues(props.max, props);
    const renderGradients = () => {
        return (
            <linearGradient id="linear" x1="0%" y1="0%" x2="100%" y2="0%">
                {props.gradients.map((gradient) => {
                    return <stop key={gradient.offset} offset={gradient.offset} stopColor={gradient.color} />;
                })}
            </linearGradient>
        );
    };
    return (
        <div className={baseWrapper}>
            <svg version="1.1" viewBox="0 0 500 500" preserveAspectRatio="xMinYMin meet" className={baseContent}>
                <defs>
                    <filter id={uniqueFilterId}>
                        <feOffset dx="0" dy="3" />
                        <feGaussianBlur result="offset-blur" stdDeviation="5" />
                        <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
                        <feFlood floodColor="black" floodOpacity="0.2" result="color" />
                        <feComposite operator="in" in="color" in2="inverse" result="shadow" />
                        <feComposite operator="over" in="shadow" in2="SourceGraphic" />
                    </filter>
                    {props.gradients && renderGradients()}
                </defs>
                <path
                    fill={props.backgroundColor}
                    stroke="none"
                    d={getPath(props.max, props)}
                    filter={'url(#' + uniqueFilterId + ')'}
                />
                <path
                    fill={props.color ? props.color : 'url(#linear)'}
                    stroke="none"
                    d={getPath(props.value, props)}
                    filter={'url(#' + uniqueFilterId + ')'}
                />
                <text x={props.width / 2} y={props.height / 8} textAnchor="middle" style={topLabelStyle}>
                    {props.label}
                </text>
                <text x={props.width / 2} y={(props.height / 5) * 4} textAnchor="middle" style={valueLabelStyle}>
                    {props.value}
                </text>
                <text
                    x={(Cx - Ro + (Cx - Ri)) / 2}
                    y={Cy + minMaxLabelsOffset}
                    textAnchor="middle"
                    style={props.minMaxLabelStyle}
                >
                    {props.min}
                </text>
                <text x={(Xo + Xi) / 2} y={Cy + minMaxLabelsOffset} textAnchor="middle" style={props.minMaxLabelStyle}>
                    {props.max}
                </text>
            </svg>
        </div>
    );
};
export default SpeedMeter;
