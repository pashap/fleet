import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

const baseClass = 'kolidecon';

export class Icon extends Component {
  static propTypes = {
    className: PropTypes.string,
    fw: PropTypes.bool,
    name: PropTypes.string.isRequired,
    size: PropTypes.string,
    title: PropTypes.string,
  };

  render () {
    const { className, fw, name, size, title } = this.props;
    const iconClasses = classnames(baseClass, `${baseClass}-${name}`, className, {
      [`${baseClass}-fw`]: fw,
      [`${baseClass}-${size}`]: size,
    });

    return (
      <i className={iconClasses} title={title} />
    );
  }
}

export default Icon;
