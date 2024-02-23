import { MarkerType, Position } from '@vue-flow/core'

const LineType = {
  marker_type_arrow:MarkerType.Arrow,
  position_right:Position.Right,
  position_left:Position.Left
}

export const initialElements = [
  {
    id: '1',
    type: 'input',
    position: { x: 50, y: 150 },
    sourcePosition: Position.Right,
    data:{ position_right:'source' }
  },
  { id: 'shuanfa1', type: "script", position: { x: 250, y: 150 } ,data:{ position_left:'target', position_right:'source' } },
  { id: 'shuanfa2', type: "script", position: { x: 450, y: 50 } ,data:{ position_left:'target', position_right:'source' } },
  { id: 'shuanfa3', type: "script", position: { x: 450, y: 250 } ,data:{ position_left:'target', position_right:'source' } },
  { id: 'shuanfa4', type: "script", position: { x: 650, y: 150 } ,data:{ position_left:'target', position_right:'source' } },
  { id: 'shuanfa5', type: "script", position: { x: 850, y: 150 } ,data:{ position_left:'target', position_right:'source' } },
  {
    id: '2',
    type: 'output',
    position: { x: 1050, y: 150 },
    targetPosition: Position.Left,
  },
  { id: 'e1-1', source: '1', target: 'shuanfa1', markerEnd:LineType['Arrow'] },
  { id: 'e1-2', source: 'shuanfa1', target: 'shuanfa2', markerEnd:LineType['marker_type_arrow'] },
  { id: 'e1-3', source: 'shuanfa1', target: 'shuanfa3', markerEnd:LineType['marker_type_arrow'] },
  { id: 'e1-4', source: 'shuanfa2', target: 'shuanfa4', markerEnd:LineType['marker_type_arrow'] },
  { id: 'e1-5', source: 'shuanfa3', target: 'shuanfa4', markerEnd:LineType['marker_type_arrow'] },
  { id: 'e1-6', source: 'shuanfa4', target: 'shuanfa5', markerEnd:LineType['marker_type_arrow'] },
  { id: 'e1-7', source: 'shuanfa5', target: '2', markerEnd:LineType['Arrow'] },
]