import { ImageResponse } from "next/og"
import { readFile } from "node:fs/promises"
import { join } from "node:path"

export const size = { width: 64, height: 64 }
export const contentType = "image/png"

export default async function Icon() {
  const imgData = await readFile(join(process.cwd(), "public/emoji-camera.png"))
  const base64 = `data:image/png;base64,${imgData.toString("base64")}`

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "black",
        }}
      >
        <img src={base64} width="46" height="46" />
      </div>
    ),
    { ...size }
  )
}
