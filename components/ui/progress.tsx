import React from "react"

type ProgressProps = {
  value: number // 0〜100
}

export function Progress({ value }: ProgressProps) {
  return (
    <div style={{ background: "#e5e7eb", borderRadius: 4, height: 8, width: "100%" }}>
      <div
        style={{
          background: "#3b82f6",
          width: `${value}%`,
          height: "100%",
          borderRadius: 4,
          transition: "width 0.3s",
        }}
      />
    </div>
  )
}