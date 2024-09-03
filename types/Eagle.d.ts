export interface MetadataJson {
    id: string
    name: string
    size: number
    btime: number
    mtime: number
    ext: string
    tags: any[]
    folders: string[]
    isDeleted: boolean
    url: string
    annotation: string
    modificationTime: number
    height: number
    width: number
    noThumbnail: boolean
    palettes: Palette[]
    lastModified: number
}

export interface Palette {
    color: number[]
    ratio: number
}
