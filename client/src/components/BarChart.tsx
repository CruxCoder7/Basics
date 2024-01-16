"use client"
import { ResponsiveBar } from "@nivo/bar"

export const MyResponsiveBar = ({
  data,
  amount_keys,
}: {
  data: any
  amount_keys: string[]
}) => (
  <ResponsiveBar
    data={data}
    keys={amount_keys}
    indexBy="category"
    margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
    padding={0.6}
    valueScale={{ type: "linear" }}
    indexScale={{ type: "band", round: true }}
    borderColor={{
      from: "color",
      modifiers: [["darker", 1.6]],
    }}
    axisTop={null}
    axisRight={null}
    axisBottom={{
      tickSize: 5,
      tickPadding: 1,
      tickRotation: 0,
      legend: "Category",
      legendPosition: "middle",
      legendOffset: 35,
      truncateTickAt: 0,
    }}
    axisLeft={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: "Amount ",
      legendPosition: "middle",
      legendOffset: -55,
      truncateTickAt: 0,
    }}
    labelSkipWidth={12}
    labelSkipHeight={12}
    labelTextColor={{
      from: "color",
      modifiers: [["darker", 1.6]],
    }}
    colors={["#8c6bb1", "#cdb9e3"]}
    legends={[
      {
        dataFrom: "keys",
        anchor: "bottom-right",
        direction: "column",
        justify: false,
        translateX: 120,
        translateY: 0,
        itemsSpacing: 2,
        itemWidth: 100,
        itemHeight: 20,
        itemDirection: "left-to-right",
        itemOpacity: 0.85,
        symbolSize: 20,
        effects: [
          {
            on: "hover",
            style: {
              itemOpacity: 1,
            },
          },
        ],
      },
    ]}
    role="application"
    barAriaLabel={(e) =>
      e.id + ": " + e.formattedValue + " in category: " + e.indexValue
    }
    theme={{
      axis: {
        legend: {
          text: {
            fontSize: 20,
          },
        },
      },
    }}
  />
)
