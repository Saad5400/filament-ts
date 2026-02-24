export class Cancel extends Error {
  protected shouldRollbackTransactionValue = false

  constructor(message = 'Operation cancelled') {
    super(message)
    this.name = 'Cancel'
  }

  rollBackDatabaseTransaction(condition = true): this {
    this.shouldRollbackTransactionValue = condition

    return this
  }

  shouldRollbackDatabaseTransaction(): boolean {
    return this.shouldRollbackTransactionValue
  }
}
