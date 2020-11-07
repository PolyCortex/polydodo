import React, { useState } from 'react';
import classnames from 'classnames';
import { Card, CardBody, NavItem, NavLink, Nav, TabContent, TabPane } from 'reactstrap';

const Tabs = ({ elements, onSelectTab, onHoverTab }) => {
  const [selectedTab, _setSelectedTab] = useState(0);
  const setSelectedTab = (event, tab) => {
    event.preventDefault();
    _setSelectedTab(tab);
  };

  return (
    <>
      <div className="nav-wrapper">
        <Nav className="nav-fill flex-column flex-md-row" id="tabs-icons-text" pills role="tablist">
          {elements.map(({ id, title }, i) => (
            <NavItem key={i}>
              <NavLink
                aria-selected={selectedTab === i}
                className={classnames('mb-sm-3 mb-md-0', {
                  active: selectedTab === i,
                })}
                onClick={(e) => {
                  onSelectTab && onSelectTab(id);
                  setSelectedTab(e, i);
                }}
                onMouseOver={() => onHoverTab && onHoverTab(id)}
                onMouseLeave={() => onHoverTab && onHoverTab(null)}
                href="#pablo"
                role="tab"
              >
                {title}
              </NavLink>
            </NavItem>
          ))}
        </Nav>
      </div>
      <Card className="shadow">
        <CardBody>
          <TabContent activeTab={'selectedTab' + selectedTab}>
            {elements.map(({ content }, i) => (
              <TabPane key={i} tabId={'selectedTab' + i}>
                <p>{content}</p>
              </TabPane>
            ))}
          </TabContent>
        </CardBody>
      </Card>
    </>
  );
};

export default Tabs;
