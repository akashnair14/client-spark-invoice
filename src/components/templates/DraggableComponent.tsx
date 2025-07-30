import { useDraggable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { TemplateComponent } from "@/types/template";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  FileText, 
  User, 
  Table, 
  Calculator, 
  StickyNote, 
  Image, 
  PenTool, 
  QrCode,
  GripVertical,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  X
} from "lucide-react";

interface DraggableComponentProps {
  component: TemplateComponent;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<TemplateComponent>) => void;
  canvasSize: { width: number; height: number };
}

const getComponentIcon = (type: TemplateComponent['type']) => {
  switch (type) {
    case 'header': return FileText;
    case 'logo': return Image;
    case 'invoice-details': return FileText;
    case 'client-info': return User;
    case 'items-table': return Table;
    case 'totals': return Calculator;
    case 'notes': return StickyNote;
    case 'signature': return PenTool;
    case 'qr-code': return QrCode;
    default: return FileText;
  }
};

const getComponentContent = (component: TemplateComponent) => {
  switch (component.type) {
    case 'header':
      return component.data?.title || 'Company Name';
    case 'logo':
      return 'LOGO';
    case 'invoice-details':
      return 'Invoice #: 001\nDate: Today\nDue: Net 30';
    case 'client-info':
      return 'Client Company\nClient Address\nGST: 123456789';
    case 'items-table':
      return 'Description | Qty | Rate | Amount\nSample Item | 1 | 100 | 100';
    case 'totals':
      return 'Subtotal: ₹100\nGST: ₹18\nTotal: ₹118';
    case 'notes':
      return 'Terms & Conditions\nPayment due within 30 days';
    case 'signature':
      return 'Authorized Signature';
    case 'qr-code':
      return '[QR]';
    default:
      return 'Component';
  }
};

export const DraggableComponent = ({
  component,
  isSelected,
  onSelect,
  onUpdate,
  canvasSize,
}: DraggableComponentProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: component.id,
    disabled: component.isLocked,
  });

  const IconComponent = getComponentIcon(component.type);

  const style = {
    position: 'absolute' as const,
    left: `${component.position.x}%`,
    top: `${component.position.y}%`,
    width: `${component.size.width}%`,
    height: `${component.size.height}%`,
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    zIndex: isDragging ? 1000 : isSelected ? 100 : 1,
    opacity: component.isVisible ? 1 : 0.5,
  };

  const handleToggleVisibility = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate({ isVisible: !component.isVisible });
  };

  const handleToggleLock = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate({ isLocked: !component.isLocked });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group transition-all duration-200",
        isSelected && "ring-2 ring-primary ring-offset-1",
        isDragging && "opacity-50",
        !component.isVisible && "opacity-50"
      )}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      <Card className={cn(
        "h-full w-full cursor-pointer border-2 transition-all",
        isSelected ? "border-primary bg-primary/5" : "border-dashed border-muted-foreground/30",
        "hover:border-primary/60 hover:bg-accent/50",
        component.isLocked && "cursor-not-allowed"
      )}>
        {/* Component header with controls */}
        <div className={cn(
          "absolute -top-8 left-0 right-0 flex items-center justify-between",
          "opacity-0 group-hover:opacity-100 transition-opacity",
          isSelected && "opacity-100"
        )}>
          <div className="flex items-center gap-1 bg-background border rounded px-2 py-1 text-xs">
            <IconComponent className="h-3 w-3" />
            <span className="font-medium">{component.type.replace('-', ' ')}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
              onClick={handleToggleVisibility}
            >
              {component.isVisible ? (
                <Eye className="h-3 w-3" />
              ) : (
                <EyeOff className="h-3 w-3" />
              )}
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
              onClick={handleToggleLock}
            >
              {component.isLocked ? (
                <Lock className="h-3 w-3" />
              ) : (
                <Unlock className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>

        {/* Drag handle */}
        {!component.isLocked && (
          <div
            {...listeners}
            {...attributes}
            className={cn(
              "absolute -top-2 -left-2 p-1 bg-primary text-primary-foreground rounded cursor-grab",
              "opacity-0 group-hover:opacity-100 transition-opacity",
              isSelected && "opacity-100",
              isDragging && "cursor-grabbing"
            )}
          >
            <GripVertical className="h-3 w-3" />
          </div>
        )}

        {/* Component content */}
        <div 
          className="h-full w-full p-2 overflow-hidden flex items-center justify-center text-center"
          style={{
            fontSize: component.styles.fontSize,
            fontWeight: component.styles.fontWeight,
            fontFamily: component.styles.fontFamily,
            color: component.styles.color,
            backgroundColor: component.styles.backgroundColor,
            textAlign: component.styles.textAlign,
          }}
        >
          {component.type === 'items-table' ? (
            <div className="w-full text-xs">
              <div className="border-b mb-1 pb-1 font-semibold">
                {component.columns?.join(' | ') || 'Description | Qty | Rate | Amount'}
              </div>
              <div>Sample Item | 1 | ₹100 | ₹100</div>
            </div>
          ) : (
            <div className="text-xs leading-tight whitespace-pre-line">
              {getComponentContent(component)}
            </div>
          )}
        </div>

        {/* Resize handles */}
        {isSelected && !component.isLocked && (
          <>
            {/* Corner resize handles */}
            <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-primary rounded-full cursor-nw-resize" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full cursor-ne-resize" />
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-primary rounded-full cursor-nw-resize" />
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-primary rounded-full cursor-ne-resize" />
          </>
        )}
      </Card>
    </div>
  );
};