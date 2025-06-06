{selectedFlow && (
  <FlowModal
    isOpen={true}
    onClose={handleCloseModal}
    flow={selectedFlow}
    onSave={() => {
      handleCloseModal()
      fetchFlows()
    }}
  />
)}
