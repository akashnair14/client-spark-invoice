import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { TemplateComponent, TemplateLayout } from "@/types/template";
import { DraggableComponent } from "./DraggableComponent";

interface TemplateCanvasProps {
  layout: TemplateLayout;
  selectedComponent: TemplateComponent | null;
  onSelectComponent: (component: TemplateComponent | null) => void;
  onUpdateComponent: (id: string, updates: Partial<TemplateComponent>) => void;
}

export const TemplateCanvas = ({
  layout,
  selectedComponent,
  onSelectComponent,
  onUpdateComponent,
}: TemplateCanvasProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas',
  });

  return (
    <div className="p-8 h-full">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4 text-center">
          <h2 className="text-lg font-semibold">A4 Invoice Template</h2>
          <p className="text-sm text-muted-foreground">
            Design your invoice layout by adding and positioning components
          </p>
        </div>
        
        {/* Canvas - A4 proportions */}
        <div
          ref={setNodeRef}
          className={cn(
            "relative bg-white border-2 border-dashed mx-auto shadow-lg",
            "w-[210mm] h-[297mm] max-w-full",
            "transform-gpu transition-colors duration-200",
            isOver ? "border-primary bg-primary/5" : "border-border",
            layout.settings?.showBorders && "bg-grid-pattern"
          )}
          style={{
            aspectRatio: "210/297", // A4 aspect ratio
            minHeight: "600px",
            backgroundImage: layout.settings?.showBorders 
              ? `radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)`
              : undefined,
            backgroundSize: layout.settings?.showBorders 
              ? `${layout.settings.gridSize || 10}px ${layout.settings.gridSize || 10}px`
              : undefined,
          }}
          onClick={(e) => {
            // Only deselect if clicking on the canvas itself
            if (e.target === e.currentTarget) {
              onSelectComponent(null);
            }
          }}
        >
          {/* Margin guides */}
          <div
            className="absolute inset-0 border border-primary/20 pointer-events-none"
            style={{
              margin: `${layout.settings?.gridSize || 20}px`,
            }}
          />

          {/* Render components */}
          {layout.components.map((component) => (
            <DraggableComponent
              key={component.id}
              component={component}
              isSelected={selectedComponent?.id === component.id}
              onSelect={() => onSelectComponent(component)}
              onUpdate={(updates) => onUpdateComponent(component.id, updates)}
              canvasSize={{ width: 210, height: 297 }} // A4 in mm
            />
          ))}

          {/* Empty state */}
          {layout.components.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <div className="text-lg font-medium mb-2">Start Building Your Invoice</div>
                <div className="text-sm">
                  Add components from the left panel to begin designing your template
                </div>
              </div>
            </div>
          )}

          {/* Canvas overlay when dragging */}
          {isOver && (
            <div className="absolute inset-0 bg-primary/10 border-2 border-primary border-dashed rounded flex items-center justify-center">
              <div className="text-primary font-medium">Drop component here</div>
            </div>
          )}
        </div>

        {/* Canvas info */}
        <div className="mt-4 text-center text-xs text-muted-foreground">
          <div>
            Paper Size: A4 (210mm × 297mm) • 
            Components: {layout.components.length} •
            Theme: {layout.theme.primaryColor}
          </div>
        </div>
      </div>
    </div>
  );
};