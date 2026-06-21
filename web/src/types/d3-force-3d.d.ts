declare module "d3-force-3d" {
  type Accessor = number | ((node: unknown, index: number, nodes: unknown[]) => number);

  interface CollisionForce {
    strength(value: number): CollisionForce;
    iterations(value: number): CollisionForce;
    radius(value: Accessor): CollisionForce;
  }

  interface PositionForce {
    strength(value: Accessor): PositionForce;
    x(value: Accessor): PositionForce;
    y(value: Accessor): PositionForce;
  }

  export function forceCollide(radius?: Accessor): CollisionForce;
  export function forceX(x?: Accessor): PositionForce;
  export function forceY(y?: Accessor): PositionForce;
}
