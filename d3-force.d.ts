declare module 'd3-force' {
  export interface SimulationNodeDatum {
    x?: number
    y?: number
    vx?: number
    vy?: number
    fx?: number | null
    fy?: number | null
    index?: number
  }

  export interface SimulationLinkDatum<NodeDatum extends SimulationNodeDatum = SimulationNodeDatum> {
    source?: NodeDatum | string | number
    target?: NodeDatum | string | number
    index?: number
  }

  export interface Simulation<NodeDatum extends SimulationNodeDatum = SimulationNodeDatum, LinkDatum extends SimulationLinkDatum<NodeDatum> = SimulationLinkDatum<NodeDatum>> {
    nodes(): NodeDatum[]
    nodes(nodes: NodeDatum[]): this
    alpha(): number
    alpha(alpha: number): this
    alphaMin(): number
    alphaMin(min: number): this
    alphaDecay(): number
    alphaDecay(decay: number): this
    alphaTarget(): number
    alphaTarget(target: number): this
    velocityDecay(): number
    velocityDecay(decay: number): this
    force<F extends Force<NodeDatum, LinkDatum>>(name: string): F | undefined
    force<F extends Force<NodeDatum, LinkDatum>>(name: string, force: F | null): this
    find(x: number, y: number, radius?: number): NodeDatum | undefined
    on(typenames: string, listener: (this: this, event: any) => void): this
    restart(): this
    stop(): this
    tick(iterations?: number): this
  }

  export interface Force<NodeDatum extends SimulationNodeDatum = SimulationNodeDatum, LinkDatum extends SimulationLinkDatum<NodeDatum> = SimulationLinkDatum<NodeDatum>> {
    (alpha: number): void
    initialize?(nodes: NodeDatum[], random: () => number): void
  }

  export function forceSimulation<NodeDatum extends SimulationNodeDatum = SimulationNodeDatum>(
    nodes?: NodeDatum[]
  ): Simulation<NodeDatum>

  export function forceSimulation<NodeDatum extends SimulationNodeDatum = SimulationNodeDatum, LinkDatum extends SimulationLinkDatum<NodeDatum> = SimulationLinkDatum<NodeDatum>>(
    nodes?: NodeDatum[]
  ): Simulation<NodeDatum, LinkDatum>

  export function forceLink<NodeDatum extends SimulationNodeDatum = SimulationNodeDatum, LinkDatum extends SimulationLinkDatum<NodeDatum> = SimulationLinkDatum<NodeDatum>>(
    links?: LinkDatum[]
  ): Force<NodeDatum, LinkDatum>

  export function forceManyBody<NodeDatum extends SimulationNodeDatum = SimulationNodeDatum>(): Force<NodeDatum>

  export function forceCenter<NodeDatum extends SimulationNodeDatum = SimulationNodeDatum>(
    x?: number,
    y?: number
  ): Force<NodeDatum>

  export function forceCollide<NodeDatum extends SimulationNodeDatum = SimulationNodeDatum>(
    radius?: number | ((node: NodeDatum, i: number, nodes: NodeDatum[]) => number)
  ): Force<NodeDatum>
}

