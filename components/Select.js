import chroma from "chroma-js"
import { useContext, useEffect, useState } from "react"

import Select from "react-select"
import { Loading } from "web3uikit"
import AppContext from "../store/AppContext"

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
  { value: 4, label: "Rinkeby", color: "#d6aed6" },
  // { value: 1, label: "ETH Mainnet", color: "green" },
  // { value: 137, label: "Polygon", color: "grey" },
  { value: 42, label: "Kovan", color: "red" },
]

const DropDown = ({ onChange }) => {
  const { network } = useContext(AppContext)

  const [defaultOption, setDefault] = useState(null)

  useEffect(() => {
    const opt = colourOptions.findIndex((op) => op.label === network.name)
    setDefault(opt)
  }, [network.name])

  return defaultOption < 0 || defaultOption === null ? (
    <Loading />
  ) : (
    <Select
      // defaultValue={colourOptions[0]}
      defaultValue={colourOptions[defaultOption]}
      options={colourOptions}
      styles={colourStyles}
      onChange={onChange}
      instanceId={"network-select-dropdown"}
    />
  )
}

export default DropDown
