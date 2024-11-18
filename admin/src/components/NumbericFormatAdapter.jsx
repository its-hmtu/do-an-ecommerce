import React from 'react'
import { NumericFormat } from 'react-number-format';

const NumbericFormatAdapter = React.forwardRef(
  function NumericFormatAdapter(props, ref) {
    const { onChange, ...other } = props;

    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        thousandSeparator
        valueIsNumericString
        // suffix=' đ'
      />
    );
  },
)

export default NumbericFormatAdapter;