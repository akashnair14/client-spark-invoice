import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/animations.css'

// Fix for React 18 + Radix UI "removeChild" error
// See: https://github.com/facebook/react/issues/11538
if (typeof Node !== 'undefined') {
  const origRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function <T extends Node>(child: T): T {
    if (child.parentNode !== this) {
      if (console.error) {
        console.error('Cannot remove child: not a child of this node', child, this);
      }
      return child;
    }
    return origRemoveChild.call(this, child) as T;
  };

  const origInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function <T extends Node>(newNode: T, refNode: Node | null): T {
    if (refNode && refNode.parentNode !== this) {
      if (console.error) {
        console.error('Cannot insert before: ref node is not a child', refNode, this);
      }
      return newNode;
    }
    return origInsertBefore.call(this, newNode, refNode) as T;
  };
}

createRoot(document.getElementById("root")!).render(<App />);
