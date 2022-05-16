import chroma from "chroma-js"
import { utils } from "ethers"

import Select from "react-select"

const dot = (color = "transparent") => ({
  alignItems: "center",
  display: "flex",

  ":before": {
    backgroundColor: color,
    borderRadius: 10,
    content: '" "',
    display: "block",
    marginRight: 8,
    height: 10,
    width: 10,
  },
})

const colourStyles = {
  control: (styles) => ({ ...styles, backgroundColor: "white" }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    const color = chroma(data.color)
    return {
      ...styles,
      backgroundColor: isDisabled
        ? undefined
        : isSelected
        ? data.color
        : isFocused
        ? color.alpha(0.1).css()
        : undefined,
      color: isDisabled
        ? "#ccc"
        : isSelected
        ? chroma.contrast(color, "white") > 2
          ? "white"
          : "black"
        : data.color,
      cursor: isDisabled ? "not-allowed" : "default",

      ":active": {
        ...styles[":active"],
        backgroundColor: !isDisabled
          ? isSelected
            ? data.color
            : color.alpha(0.3).css()
          : undefined,
      },
    }
  },
  input: (styles) => ({ ...styles, ...dot() }),
  placeholder: (styles) => ({ ...styles, ...dot("#ccc") }),
  singleValue: (styles, { data }) => ({ ...styles, ...dot(data.color) }),
}

const colourOptions = [
  { value: "0x4", label: "Rinkeby", color: "#d6aed6" },
  { value: utils.hexValue(42), label: "Kovan", color: "#d6aed6" },
  { value: "0x1", label: "ETH Mainnet", color: "green" },
  { value: utils.hexValue(137), label: "Polygon", color: "grey" },
]

const DropDown = ({ onChange }) => (
  <Select
    defaultValue={colourOptions[0]}
    options={colourOptions}
    styles={colourStyles}
    onChange={onChange}
    instanceId={"network-select-dropdown"}
  />
)

export default DropDown
