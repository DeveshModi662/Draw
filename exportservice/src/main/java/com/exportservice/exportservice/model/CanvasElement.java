package com.exportservice.exportservice.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

import org.bson.types.ObjectId;

@Document(collection = "CanvasElements")
public class CanvasElement {

    @Id
    @JsonSerialize(using = ToStringSerializer.class)
    private ObjectId id; // MongoDB _id

    private int eleId;

    // Just store the canvas id, no DBRef needed
    @JsonSerialize(using = ToStringSerializer.class)
    private ObjectId canvasId;

    private int x1;
    private int y1;
    private int x2;
    private int y2;

    private ElementGenerator elementGenerator;

    private int len;

    // getters and setters

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public int getEleId() {
        return eleId;
    }

    public void setEleId(int eleId) {
        this.eleId = eleId;
    }

    public ObjectId getCanvasId() {
        return canvasId;
    }

    public void setCanvasId(ObjectId canvasId) {
        this.canvasId = canvasId;
    }

    public int getX1() {
        return x1;
    }

    public void setX1(int x1) {
        this.x1 = x1;
    }

    public int getY1() {
        return y1;
    }

    public void setY1(int y1) {
        this.y1 = y1;
    }

    public int getX2() {
        return x2;
    }

    public void setX2(int x2) {
        this.x2 = x2;
    }

    public int getY2() {
        return y2;
    }

    public void setY2(int y2) {
        this.y2 = y2;
    }

    public ElementGenerator getElementGenerator() {
        return elementGenerator;
    }

    public void setElementGenerator(ElementGenerator elementGenerator) {
        this.elementGenerator = elementGenerator;
    }

    public int getLen() {
        return len;
    }

    public void setLen(int len) {
        this.len = len;
    }

    public static class ElementGenerator {
        private String shape;
        private Set[] sets;
        private Options options;
        public String getShape() {
            return shape;
        }
        public void setShape(String shape) {
            this.shape = shape;
        }
        public Set[] getSets() {
            return sets;
        }
        public void setSets(Set[] sets) {
            this.sets = sets;
        }
        public Options getOptions() {
            return options;
        }
        public void setOptions(Options options) {
            this.options = options;
        }

        // getters and setters
    }

    public static class Set {
        private String type;
        private Op[] ops;
        // getters and setters
        public String getType() {
            return type;
        }
        public void setType(String type) {
            this.type = type;
        }
        public Op[] getOps() {
            return ops;
        }
        public void setOps(Op[] ops) {
            this.ops = ops;
        }
    }

    public static class Op {
        private String op;
        private double[] data;
        // getters and setters
        public String getOp() {
            return op;
        }
        public void setOp(String op) {
            this.op = op;
        }
        public double[] getData() {
            return data;
        }
        public void setData(double[] data) {
            this.data = data;
        }
    }

    public static class Options {
        private double maxRandomnessOffset;
        private double roughness;
        public double getMaxRandomnessOffset() {
            return maxRandomnessOffset;
        }
        public void setMaxRandomnessOffset(double maxRandomnessOffset) {
            this.maxRandomnessOffset = maxRandomnessOffset;
        }
        public double getRoughness() {
            return roughness;
        }
        public void setRoughness(double roughness) {
            this.roughness = roughness;
        }
        public double getBowing() {
            return bowing;
        }
        public void setBowing(double bowing) {
            this.bowing = bowing;
        }
        public String getStroke() {
            return stroke;
        }
        public void setStroke(String stroke) {
            this.stroke = stroke;
        }
        public double getStrokeWidth() {
            return strokeWidth;
        }
        public void setStrokeWidth(double strokeWidth) {
            this.strokeWidth = strokeWidth;
        }
        public double getCurveTightness() {
            return curveTightness;
        }
        public void setCurveTightness(double curveTightness) {
            this.curveTightness = curveTightness;
        }
        public double getCurveFitting() {
            return curveFitting;
        }
        public void setCurveFitting(double curveFitting) {
            this.curveFitting = curveFitting;
        }
        public double getCurveStepCount() {
            return curveStepCount;
        }
        public void setCurveStepCount(double curveStepCount) {
            this.curveStepCount = curveStepCount;
        }
        public String getFillStyle() {
            return fillStyle;
        }
        public void setFillStyle(String fillStyle) {
            this.fillStyle = fillStyle;
        }
        public double getFillWeight() {
            return fillWeight;
        }
        public void setFillWeight(double fillWeight) {
            this.fillWeight = fillWeight;
        }
        public double getHachureAngle() {
            return hachureAngle;
        }
        public void setHachureAngle(double hachureAngle) {
            this.hachureAngle = hachureAngle;
        }
        public double getHachureGap() {
            return hachureGap;
        }
        public void setHachureGap(double hachureGap) {
            this.hachureGap = hachureGap;
        }
        public double getDashOffset() {
            return dashOffset;
        }
        public void setDashOffset(double dashOffset) {
            this.dashOffset = dashOffset;
        }
        public double getDashGap() {
            return dashGap;
        }
        public void setDashGap(double dashGap) {
            this.dashGap = dashGap;
        }
        public double getZigzagOffset() {
            return zigzagOffset;
        }
        public void setZigzagOffset(double zigzagOffset) {
            this.zigzagOffset = zigzagOffset;
        }
        public long getSeed() {
            return seed;
        }
        public void setSeed(long seed) {
            this.seed = seed;
        }
        public boolean isDisableMultiStroke() {
            return disableMultiStroke;
        }
        public void setDisableMultiStroke(boolean disableMultiStroke) {
            this.disableMultiStroke = disableMultiStroke;
        }
        public boolean isDisableMultiStrokeFill() {
            return disableMultiStrokeFill;
        }
        public void setDisableMultiStrokeFill(boolean disableMultiStrokeFill) {
            this.disableMultiStrokeFill = disableMultiStrokeFill;
        }
        public boolean isPreserveVertices() {
            return preserveVertices;
        }
        public void setPreserveVertices(boolean preserveVertices) {
            this.preserveVertices = preserveVertices;
        }
        public double getFillShapeRoughnessGain() {
            return fillShapeRoughnessGain;
        }
        public void setFillShapeRoughnessGain(double fillShapeRoughnessGain) {
            this.fillShapeRoughnessGain = fillShapeRoughnessGain;
        }
        public Randomizer getRandomizer() {
            return randomizer;
        }
        public void setRandomizer(Randomizer randomizer) {
            this.randomizer = randomizer;
        }
        private double bowing;
        private String stroke;
        private double strokeWidth;
        private double curveTightness;
        private double curveFitting;
        private double curveStepCount;
        private String fillStyle;
        private double fillWeight;
        private double hachureAngle;
        private double hachureGap;
        private double dashOffset;
        private double dashGap;
        private double zigzagOffset;
        private long seed;
        private boolean disableMultiStroke;
        private boolean disableMultiStrokeFill;
        private boolean preserveVertices;
        private double fillShapeRoughnessGain;
        private Randomizer randomizer;
        // getters and setters
    }

    public static class Randomizer {
        private long seed;
        // getters and setters

        public long getSeed() {
            return seed;
        }

        public void setSeed(long seed) {
            this.seed = seed;
        }
    }
}
