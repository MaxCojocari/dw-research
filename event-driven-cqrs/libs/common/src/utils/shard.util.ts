export function getShardName(accountId: string) {
  const hash = accountId.charCodeAt(accountId.length - 1);
  return hash % 2 === 0 ? 'shard-1' : 'shard-2';
}
