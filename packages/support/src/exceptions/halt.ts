export class Halt extends Error {
  protected shouldRollbackTransactionValue = false

  constructor(message = 'Operation halted') {
    super(message)
    this.name = 'Halt'
  }

  rollBackDatabaseTransaction(condition = true): this {
    this.shouldRollbackTransactionValue = condition

    return this
  }

  shouldRollbackDatabaseTransaction(): boolean {
    return this.shouldRollbackTransactionValue
  }
}
