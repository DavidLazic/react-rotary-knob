// @flow
import React, { Component } from "react";
import HelpersOverlay from "./HelpersOverlay";
import DrawCircle from "./DrawCircle";
import DrawLine from "./DrawLine";
import type { Point } from "../Types";
import utils from "../utils";

/** Precision visual helpers */

/**
 * Precision mode visual helpers
 */
type KnobVisualHelpersProps = {
  svgRef: any,
  radius: number,
  minimumDragDistance: number,
  valueAngle: number,
  mousePos: Point
};

type KnobVisualHelpersState = {
  centerX: number,
  centerY: number,
  valueMarkerX: number,
  valueMarkerY: number
};

class KnobVisualHelpers extends React.Component<
  KnobVisualHelpersProps,
  KnobVisualHelpersState
> {
  state = {
    centerX: 0,
    centerY: 0,
    valueMarkerX: 0,
    valueMarkerY: 0
  };

  componentDidMount() {
    this.recalculateContainerPosition(this.props);
  }

  componentWillReceiveProps(nextProps: KnobVisualHelpersProps) {
    this.recalculateContainerPosition(nextProps);
  }

  recalculateContainerPosition(props: KnobVisualHelpersProps) {
    //Calculate position
    const box = props.svgRef.getBoundingClientRect();
    const vbox = utils.transformBoundingClientRectToViewport(box);
    const halfWidth = box.width / 2;

    //Calculate current angle segment end point
    //Note: Not sure why we need to substract 90 here
    const valueMarkerX =
      props.radius * Math.cos(utils.toRadians(props.valueAngle - 90));
    const valueMarkerY =
      props.radius * Math.sin(utils.toRadians(props.valueAngle - 90));

    this.setState({
      ...this.state,
      centerX: vbox.left + halfWidth,
      centerY: vbox.top + halfWidth,
      valueMarkerX,
      valueMarkerY
    });
  }

  render() {
    const markCircleColor =
      this.props.minimumDragDistance <= this.props.radius ? "green" : "grey";
    const fillColor =
      this.props.minimumDragDistance <= this.props.radius
        ? "#88E22D"
        : "#D8D8D8";
    const minDistanceCueVisible = this.props.minimumDragDistance >= this.props.radius;

    return (
      <HelpersOverlay>
        <svg
          style={{ position: "absolute", top: "0", left: "0" }}
          width="100%"
          height="100%"
        >
          <defs>
            <marker
              id="Triangle"
              viewBox="0 0 10 10"
              refX="1"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" />
            </marker>
          </defs>

          {/* Current drag distance */}
          <DrawCircle
            borderColor={markCircleColor}
            fillColor={fillColor}
            fillOpacity={0.02}
            r={this.props.radius}
            cx={this.state.centerX}
            cy={this.state.centerY}
          />
          {/* Minimum drag distance marker */}
          {minDistanceCueVisible &&<DrawCircle
            borderColor={markCircleColor}
            fillColor={fillColor}
            fillOpacity={0}
            r={this.props.minimumDragDistance}
            cx={this.state.centerX}
            cy={this.state.centerY}
            strokeDasharray="5, 5"
          />}

          {/* Line to mouse position */}
          {/* <DrawLine
            p1={{ x: this.state.centerX, y: this.state.centerY }}
            p2={{ x: this.props.mousePos.x, y: this.props.mousePos.y }}
            opacity={0.4}
            strokeDasharray="5, 5"
          /> */}
          {/* Line to current value */}
          <DrawLine
            p1={{ x: this.state.centerX, y: this.state.centerY }}
            p2={{
              x: this.state.valueMarkerX + this.state.centerX,
              y: this.state.valueMarkerY + this.state.centerY
            }}
            markerEnd="url(#Triangle)"
          />
        </svg>
      </HelpersOverlay>
    );
  }
}

export { KnobVisualHelpers };
