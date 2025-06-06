import React from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import Flow from './Flow';

export default function FlowWrapper() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
} 