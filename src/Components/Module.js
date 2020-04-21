import React from 'react'
import { Card, Skeleton } from 'antd'

const Module = ({ title, loading, children, bordered }) => {
  return (
    <Card className={'module-card' + (bordered ? ' no-margin' : '')} bordered={bordered ? true : false}>
      {loading ? (
        <Skeleton active />
      ) : (
        <>
          {title}
          {children}
        </>
      )}
    </Card>
  )
}

export default Module
