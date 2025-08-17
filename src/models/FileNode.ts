interface FileNode {
    name: string
    path: string
    isDirectory: boolean
    /**
     * Whether the file or directory is open in the file explorer. Only available if `isDirectory` is true.
     */
    open?: boolean
    /**
     * The child nodes of this directory, if it is a directory.
     */
    children?: FileNode[]
}

export default FileNode
