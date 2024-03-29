/**
 * AI 的基本配置项
 */
export interface IAI {
  opening: boolean; // 使用开局库
  searchDeep: number; // 搜索深度
  countLimit: number; // gen函数返回的节点数量上限，超过之后将会按照分数进行截断
  timeLimit: number; // 时间限制，秒
  vcxDeep: number; // 算杀深度
  random: boolean; // 在分数差不多的时候是不是随机选择一个走
  log: boolean;
  // 下面几个设置都是用来提升搜索速度的
  spreadLimit: number; // 单步延伸 长度限制
  star: boolean; // 是否开启 starspread
  // TODO: 目前开启缓存后，搜索会出现一些未知的bug
  // 使用缓存, 其实只有搜索的缓存有用，其他缓存几乎无用。
  // 因为只有搜索的缓存命中后就能剪掉一整个分支，这个分支一般会包含很多个点。
  // 而在其他地方加缓存，每次命中只能剪掉一个点，影响不大。
  cache: boolean;
  window: boolean; // 启用期望窗口，由于用的模糊比较，所以和期望窗口是有冲突的

  // 调试
  debug: boolean; // 打印详细的debug信息
}
