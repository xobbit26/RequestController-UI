import React from 'react';
import Paper from '@material-ui/core/Paper';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import i18next from 'i18next';

import { requestEvents } from '../../store/events/actions';
import { REQUEST_EVENTS_URL, api } from '../../api/api';
import { gridConstants } from '../../constants/gridConstants';
import Grid from '../../sharedComponents/grid/Grid';

import { withStyles } from '@material-ui/core/styles';
import eventListStyles from './events-styles';

class Events extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            grid: {
                page: 0,
                rowsPerPage: gridConstants.defaultItemsPerPage,
                orderBy: 'applyDateTime',
                order: 'asc'
            }
        }

        this.requestEventsGridData = this.requestEventsGridData.bind(this);
    };

    componentDidMount() {
        const { page, rowsPerPage, orderBy, order } = this.state.grid;
        this.requestEventsGridData(page, rowsPerPage, orderBy, order);
    }

    requestEventsGridData(page, itemsPerPage, orderBy, order) {

        //TODO: After creating loader it needt to get language parameter from i18next api
        console.log("i18next.language", i18next.language);
        const language = 'en';

        const skip = page * itemsPerPage;
        const url = `${REQUEST_EVENTS_URL}/${language}?skip=${skip}&take=${itemsPerPage}&orderBy=${orderBy}&direction=${order}`;

        api.get(url)
            .then((data) => {
                this.props.requestEvents(data);
            })
            .then(() => {
                this.setState({
                    grid: {
                        rowsPerPage: itemsPerPage,
                        page: page,
                        orderBy: orderBy,
                        order: order
                    }
                });
            });
    }

    render() {
        const { page, rowsPerPage, orderBy, order } = this.state.grid;
        const { classes, eventsGridData } = this.props;
        const { isGridEmpty, data, columns, totalItems } = eventsGridData;

        return (
            <Paper className={classes.root}>
                {!isGridEmpty &&
                    <Grid columns={columns}
                        data={data}
                        totalItems={totalItems}
                        onChangePage={this.requestEventsGridData}
                        onChangeRowsNumber={this.requestEventsGridData}
                        onSort={this.requestEventsGridData}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        withPaging={true}
                        orderBy={orderBy}
                        order={order} />
                }
            </Paper>
        )
    }
};

Events.propTypes = {
    eventsGridData: PropTypes.object,
    requestEvents: PropTypes.func
}

const mapStateToProps = (state) => ({
    eventsGridData: state.events.get('eventsGridData').toJS()
});

const mapDispatchToProps = {
    requestEvents
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withStyles(eventListStyles)
)(Events);