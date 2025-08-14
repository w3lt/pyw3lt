export default interface RustFileNode {
  name: string
  path: string
  is_dir: boolean
  children?: RustFileNode[]
}