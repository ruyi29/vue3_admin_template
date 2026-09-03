<template>
  <el-card>
    <el-form :inline="true">
      <el-form-item label="一级分类">
        <el-select style="width: 180px">
          <el-option label="选项1"></el-option>
          <el-option label="选项1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select style="width: 180px">
          <el-option label="选项1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select style="width: 180px">
          <el-option label="选项1"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts"></script>

<style scoped></style>
