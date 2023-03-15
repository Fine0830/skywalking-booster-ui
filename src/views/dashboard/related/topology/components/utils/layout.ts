/**
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import * as d3 from "d3";
import type { Node, Call } from "@/types/topology";

export function layout(levels: Node[][], calls: Call[]) {
  // precompute level depth
  levels.forEach((l: any, i: any) => l.forEach((n: any) => (n.level = i)));

  const nodes = levels.reduce((a: any, x: any) => a.concat(x), []);
  // layout
  const padding = 30;
  const node_height = 120;
  const node_width = 100;
  const bundle_width = 14;
  const metro_d = 4;

  nodes.forEach((n: { height: number }) => (n.height = 5 * metro_d));

  let x_offset = padding;
  let y_offset = 0;
  levels.forEach((l: any) => {
    y_offset = 0;
    x_offset += 5 * bundle_width;
    l.forEach((n: any) => {
      for (const call of calls) {
        if (call.source === n.id) {
          call.sourceObj = n;
        }
        if (call.target === n.id) {
          call.targetObj = n;
        }
      }
      n.x = n.level * node_width + x_offset;
      n.y = node_height + y_offset + n.height / 2;
      y_offset += node_height + n.height;
    });
  });

  const layout = {
    width: d3.max(nodes, (n: { x: number }) => n.x) || 0 + node_width + 2 * padding,
    height: d3.max(nodes, (n: { y: number }) => n.y) || 0 + node_height / 2 + 2 * padding,
  };

  return { nodes, layout, calls };
}
