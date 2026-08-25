import { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Eraser } from 'lucide-react';

export interface DrawingCanvasHandle {
  hasContent: () => boolean;
  clear: () => void;
  getDataURL: () => string;
}

interface DrawingCanvasProps {
  color?: string;
  className?: string;
}

export const DrawingCanvas = forwardRef<DrawingCanvasHandle, DrawingCanvasProps>(
  ({ color = '#1e293b', className = '' }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
    const drawing = useRef(false);
    const lastPoint = useRef<{ x: number; y: number } | null>(null);
    const hasDrawn = useRef(false);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ratio = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.scale(ratio, ratio);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 6;
      ctx.strokeStyle = color;
      ctxRef.current = ctx;
    }, [color]);

    function getPos(e: React.PointerEvent): { x: number; y: number } {
      const canvas = canvasRef.current!;
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    function startDraw(e: React.PointerEvent) {
      e.preventDefault();
      drawing.current = true;
      lastPoint.current = getPos(e);
      hasDrawn.current = true;
      (e.target as Element).setPointerCapture?.(e.pointerId);
    }

    function draw(e: React.PointerEvent) {
      if (!drawing.current || !ctxRef.current || !lastPoint.current) return;
      e.preventDefault();
      const pos = getPos(e);
      ctxRef.current.beginPath();
      ctxRef.current.moveTo(lastPoint.current.x, lastPoint.current.y);
      ctxRef.current.lineTo(pos.x, pos.y);
      ctxRef.current.stroke();
      lastPoint.current = pos;
    }

    function endDraw(e: React.PointerEvent) {
      e.preventDefault();
      drawing.current = false;
      lastPoint.current = null;
    }

    function clear() {
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      hasDrawn.current = false;
    }

    useImperativeHandle(ref, () => ({
      hasContent: () => hasDrawn.current,
      clear,
      getDataURL: () => canvasRef.current?.toDataURL() ?? '',
    }));

    return (
      <div className={className}>
        <canvas
          ref={canvasRef}
          onPointerDown={startDraw}
          onPointerMove={draw}
          onPointerUp={endDraw}
          onPointerLeave={endDraw}
          className="w-full h-56 rounded-2xl border-2 border-dashed border-slate-300 bg-white touch-none cursor-crosshair"
          style={{ touchAction: 'none' }}
        />
        <button
          onClick={clear}
          className="mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-sm font-bold hover:bg-slate-200"
        >
          <Eraser className="w-4 h-4" /> Hapus
        </button>
      </div>
    );
  }
);

DrawingCanvas.displayName = 'DrawingCanvas';
