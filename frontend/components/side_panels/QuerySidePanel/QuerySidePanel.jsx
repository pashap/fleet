import React, { Component, PropTypes } from 'react';

import Button from '../../buttons/Button';
import {
  availability,
  columnsToRender,
  displayTypeForDataType,
  numAdditionalColumns,
  shouldShowAllColumns,
} from './helpers';
import osqueryTableInterface from '../../../interfaces/osquery_table';
import { osqueryTables } from '../../../utilities/osquery_tables';
import SecondarySidePanelContainer from '../SecondarySidePanelContainer';

const baseClass = 'query-side-panel';

class QuerySidePanel extends Component {
  static propTypes = {
    onOsqueryTableSelect: PropTypes.func,
    onTextEditorInputChange: PropTypes.func,
    selectedOsqueryTable: osqueryTableInterface,
  };

  componentWillMount () {
    const { selectedOsqueryTable } = this.props;
    const showAllColumns = shouldShowAllColumns(selectedOsqueryTable);

    this.setState({ showAllColumns });
  }

  componentWillReceiveProps (nextProps) {
    const { selectedOsqueryTable } = nextProps;

    if (this.props.selectedOsqueryTable !== selectedOsqueryTable) {
      const showAllColumns = shouldShowAllColumns(selectedOsqueryTable);

      this.setState({ showAllColumns });
    }

    return false;
  }

  onSelectTable = ({ target }) => {
    const { onOsqueryTableSelect } = this.props;
    const { value: tableName } = target;

    onOsqueryTableSelect(tableName);

    return false;
  }

  onShowAllColumns = () => {
    this.setState({ showAllColumns: true });
  }

  onSuggestedQueryClick = (query) => {
    return (evt) => {
      evt.preventDefault();

      const { onTextEditorInputChange } = this.props;

      return onTextEditorInputChange(query);
    };
  };

  renderColumns = () => {
    const { selectedOsqueryTable } = this.props;
    const { showAllColumns } = this.state;
    const columns = columnsToRender(selectedOsqueryTable, showAllColumns);

    return columns.map((column) => {
      return (
        <div key={column.name} className={`${baseClass}__column-wrapper`}>
          <span className={`${baseClass}__column-name`}>{column.name}</span>
          <div>
            <span>{displayTypeForDataType(column.type)}</span>
            <i className={`${baseClass}__help kolidecon-help`} title={column.description} />
          </div>
        </div>
      );
    });
  }

  renderMoreColumns = () => {
    const { selectedOsqueryTable } = this.props;
    const { showAllColumns } = this.state;
    const { onShowAllColumns } = this;

    if (showAllColumns) {
      return false;
    }

    return (
      <div className={`${baseClass}__column-wrapper`}>
        <span className={`${baseClass}__more-columns`}>{numAdditionalColumns(selectedOsqueryTable)} MORE COLUMNS</span>
        <button className={`btn--unstyled ${baseClass}__show-columns`} onClick={onShowAllColumns}>SHOW</button>
      </div>
    );
  }

  renderSuggestedQueries = () => {
    const { onSuggestedQueryClick } = this;
    const { selectedOsqueryTable } = this.props;

    return selectedOsqueryTable.examples.map((example) => {
      return (
        <div key={example} className={`${baseClass}__column-wrapper`}>
          <span className={`${baseClass}__suggestion`}>{example}</span>
          <Button
            onClick={onSuggestedQueryClick(example)}
            className={`${baseClass}__load-suggestion`}
            text="LOAD"
          />
        </div>
      );
    });
  }

  renderTableSelect = () => {
    const { onSelectTable } = this;
    const { selectedOsqueryTable } = this.props;

    return (
      <div className="kolide-dropdown__wrapper">
        <select className="kolide-dropdown" onChange={onSelectTable} value={selectedOsqueryTable.name}>
          {osqueryTables.map((table) => {
            return <option key={table.name} value={table.name} className="kolide-dropdown__option">{table.name}</option>;
          })}
        </select>
      </div>
    );
  }

  render () {
    const {
      renderColumns,
      renderMoreColumns,
      renderTableSelect,
      renderSuggestedQueries,
    } = this;
    const { selectedOsqueryTable: { description, platform } } = this.props;

    return (
      <SecondarySidePanelContainer className={baseClass}>
        <p className={`${baseClass}__header`}>Choose a Table</p>
        {renderTableSelect()}
        <p className={`${baseClass}__table`}>{description}</p>
        <div>
          <p className={`${baseClass}__header`}>OS Availability</p>
          <p className={`${baseClass}__platform`}>{availability(platform)}</p>
        </div>
        <div>
          <p className={`${baseClass}__header`}>Columns</p>
          {renderColumns()}
          {renderMoreColumns()}
        </div>
        <div>
          <p className={`${baseClass}__header`}>Joins</p>
        </div>
        <div>
          <p className={`${baseClass}__header`}>Suggested Queries</p>
          {renderSuggestedQueries()}
        </div>
      </SecondarySidePanelContainer>
    );
  }
}

export default QuerySidePanel;